from google.cloud import firestore, storage
import os
import pandas as pd

truths = pd.read_csv("train.csv")
path_label_dict = truths.set_index("file_name")["label"].to_dict()

def populate_firestore():

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
    
    # Create a dictionary that maps each image path to its corresponding label.

    db = firestore.Client()
    storage_client = storage.Client()
    bucket_name = "crowdsourcing-ca728.firebasestorage.app"  # Replace with your bucket's name
    bucket = storage_client.bucket(bucket_name)
    blobs = bucket.list_blobs()

    file_names = [blob.name for blob in blobs]

    # Example data to populate. Adjust collection name and documents as needed.
    users_data = [{"id": name, "truth": path_label_dict["train_data/"+name]} for name in file_names]

    # Specify the collection where documents will be added.
    collection_ref = db.collection("trainimg")

    # Populate Firestore with each document.
    for user in users_data:
        # .add() adds a new document with an auto-generated ID.
        _, doc_ref = collection_ref.add(user)
        print(f"Added document with ID: {doc_ref.id}")

if __name__ == "__main__":
    populate_firestore()