import socket
import subprocess
import os
import sys

def is_port_in_use(port):
    """Check if a given port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_available_port(start_port, max_port=8050):
    """Find the next available port starting from start_port."""
    for port in range(start_port, max_port):
        if not is_port_in_use(port):
            return port
    return None

def update_frontend_config(port):
    """Update the frontend's axios configuration to use the new port automatically."""
    frontend_api_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "api", "axios.js")
    
    if not os.path.exists(frontend_api_path):
        print("⚠️ Warning: Frontend axios config not found. You may need to manually update the backend URL.")
        return

    try:
        with open(frontend_api_path, "r") as f:
            content = f.read()
        
        import re
        new_content = re.sub(r"baseURL:\s*['\"]http://localhost:\d+['\"]", f"baseURL: 'http://localhost:{port}'", content)
        
        with open(frontend_api_path, "w") as f:
            f.write(new_content)
            
        print(f"✅ Automatically updated frontend configuration to use backend on port {port}")
    except Exception as e:
        print(f"⚠️ Could not update frontend config automatically: {e}")

def get_processes_using_port(port):
    """Get PIDs of processes using the given port using lsof (Mac/Linux)."""
    try:
        result = subprocess.check_output(f"lsof -i :{port} -t", shell=True, text=True, stderr=subprocess.DEVNULL)
        pids = [pid.strip() for pid in result.strip().split() if pid.strip()]
        return pids
    except subprocess.CalledProcessError:
        return []

def free_port(port):
    """Forcefully kill any process occupying the given port."""
    pids = get_processes_using_port(port)
    if not pids:
        print(f"✅ Port {port} is already free. No processes found.")
        return False
        
    print(f"⚠️ Port {port} is occupied by PID(s): {', '.join(pids)}")
    for pid in pids:
        try:
            print(f"🔪 Killing process {pid}...")
            # Send SIGKILL (kill -9)
            if hasattr(os, 'kill'):
                os.kill(int(pid), 9)
            else:
                subprocess.run(["kill", "-9", str(pid)])
        except OSError as e:
            print(f"❌ Failed to kill process {pid}. You may need elevated privileges. Error: {e}")
            return False
            
    print(f"✅ Successfully freed port {port}.")
    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Mange and Start the EduSense AI Backend server")
    parser.add_argument("--free", type=int, help="Kill processes occupying the specified port", metavar="PORT")
    parser.add_argument("--port", type=int, default=8000, help="Target starting port (default: 8000)")
    
    args = parser.parse_args()

    
    if args.free:
        free_port(args.free)
        sys.exit(0)

    target_port = args.port
    
    
    if is_port_in_use(target_port):
        print(f"\n⚠️  [WARN] Port {target_port} is already in use by another application!")
        print(f"💡 Tip: If you want to force free this port, exit and run: `python run_server.py --free {target_port}`")
        print("🔍 Searching for the next available port...\n")
        
        target_port = find_available_port(target_port + 1)
        
        if not target_port:
            print(f"❌ Could not find any available port between {args.port} and 8050. Please check your system.")
            sys.exit(1)
            
    print(f"🚀 Starting Uvicorn API server on port >>> {target_port} <<<\n")
    
    
    update_frontend_config(target_port)
    
    print("-" * 50)
    print(f"Server is available at: http://127.0.0.1:{target_port}")
    print("Press CTRL+C to stop")
    print("-" * 50)
    
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app:app", 
            "--host", "127.0.0.1", 
            "--port", str(target_port), 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\nStopping server gracefully...")
        sys.exit(0)
