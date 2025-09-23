from flask import Flask, request, make_response, jsonify
from escpos.printer import Network
import time
import traceback
from flask_cors import CORS

#pip install flask --> flask library
#pip install escpos --> esc/pos library
#pip install flask-cors --> needed to update Cross Origin Resource Sharing policiy
#pip install pywin32 --> might need pywin32 library

app = Flask(__name__)
CORS(app)

HOST_IP = "192.168.29.10"       # Update with your IP
PRINTER_IP = "192.168.29.9"   # replace with the printer's IP
PRINTER_PORT = 9100           # default port printer listens on

@app.route('/')
def home():
    return "home"

@app.route('/print/network', methods=["POST"])
def printNurseTicket():
    data = request.json
    facility = data['facility']
    ticket = data['ticket']
    print(data)
    try:
        p = Network(PRINTER_IP, PRINTER_PORT)
        #this is what is printed - - - note: height & width should be <=8
        p.set(align="center", bold=True,custom_size=True, height= 3, width=3)
        p.text(f"Ticket: {ticket}\n\n")

        p.set(align="center", bold=False,custom_size=True, height=2, width=2)
        p.text(f"{facility}\n\n\n")

        p.set(align="left", bold=False, height=1, width=1)
        p.text(f"Name:.........................................\n\n")
        p.text(f"ID #:.........................................\n\n")
        p.text(f"ICD Code:.....................................\n\n")
        p.text(f"Date of follow-up:............................\n\n")
        #p.text("." * 40 + "\n")

        p.cut()
        time.sleep(0.2)
        p.close()

        return jsonify({"status": "printed via network"}), 200
    except Exception as e:
        traceback.print_exc()  # logs full stack trace to console
        return jsonify({
            "error": str(e),
            "type": type(e).__name__
        }), 500

if __name__ == '__main__':
    #app.run(debug = True)
    app.run(host=HOST_IP, debug=True) #remember to set host IP to the computer's current IP
