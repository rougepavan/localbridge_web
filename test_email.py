import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_CONFIG = {
    "server": "smtp.gmail.com",
    "port": 465,
    "email": "localbridgeofficial@gmail.com",
    "password": "jnfd voxt vgwf nqik"
}

def test_send_email(receiver_email, otp):
    print(f"Testing email to {receiver_email} with OTP {otp}...")
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_CONFIG["email"]
        msg['To'] = receiver_email
        msg['Subject'] = "LocalBridge Test OTP"
        msg.attach(MIMEText(f"Your test code is: {otp}", 'plain'))
        
        server = smtplib.SMTP_SSL(SMTP_CONFIG["server"], SMTP_CONFIG["port"], timeout=10)
        server.login(SMTP_CONFIG["email"], SMTP_CONFIG["password"])
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
        return True
    except Exception as e:
        print(f"SMTP ERROR: {e}")
        return False

if __name__ == "__main__":
    test_send_email("pavanofficial897@gmail.com", "1234")
