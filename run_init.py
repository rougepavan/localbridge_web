from app import init_db

if __name__ == "__main__":
    print("Running init_db to fix schema...")
    init_db()
    print("Done.")
