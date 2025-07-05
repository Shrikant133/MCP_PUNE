import folium
import gradio as gr
import tempfile
import threading
import http.server
import socketserver
import os
import webbrowser

# Step 1: Generate the map
def generate_map_html():
    m = folium.Map(location=[18.5204, 73.8567], zoom_start=12)
    folium.Marker([18.5204, 73.8567], popup="Pune Center").add_to(m)

    output_path = os.path.join(os.getcwd(), "map.html")
    m.save(output_path)
    return output_path

# Step 2: Serve the map.html via simple HTTP server
def start_http_server(port=8080):
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving map on http://localhost:{port}/map.html")
        httpd.serve_forever()

# Step 3: Launch Gradio with iframe pointing to local server
def show_map_ui():
    map_path = generate_map_html()

    with gr.Blocks() as demo:
        gr.HTML("<h2>🗺️ Interactive Map of Pune</h2>")
        gr.HTML(f'<iframe src="http://localhost:8080/map.html" width="100%" height="600px"></iframe>')

    demo.launch(server_port=8080)

# Step 4: Run the server in background
threading.Thread(target=start_http_server, daemon=True).start()

# Step 5: Run the Gradio interface
show_map_ui()
