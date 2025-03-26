from google.cloud import firestore
import os

def populate_firestore():

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

    db = firestore.Client()

    # Specify the collection where documents will be added.
    collection_ref = db.collection("trainimg")

    docs = collection_ref.get()
    print("Number of documents in 'labels':", len(docs))
    for doc in docs:
        dic = doc.to_dict()
        print("open /Users/eliadohler/Downloads/test_data_v2/" + dic["id"])
        input("Press Enter to continue...")
        if dic["label"]:
            print("AI") 
        else:
            print("Not AI")
        input("Press Enter to continue...")

if __name__ == "__main__":
    populate_firestore()