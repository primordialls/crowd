import { useState } from 'react'
import { app } from './main.tsx'
import './App.css'
import { getFirestore, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react'

function App() {
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [myImage, setMyImage] = useState('');
  const [path, setPath] = useState('');

  useEffect(() => {
    fetchImage()
  }, [])

  // Fetch image URL from Firebase Storage
  function fetchImage() {
    const randomCollectionRef = collection(db, 'images');
    
    getDocs(randomCollectionRef)
      .then(querySnapshot => {
        const docs = querySnapshot.docs;
        if (docs.length > 0) {
          const firstDoc = docs[0];
          const doc = firstDoc.data();
          console.log(doc);
          
          // Access doc.id here inside the promise chain
          if (doc && doc.id) {
            const imageRef = ref(storage, doc.id);
            setPath(doc.id);
            deleteDoc(firstDoc.ref)
              .then(() => {
          console.log("Document successfully deleted from the collection.");
              });
            return getDownloadURL(imageRef);
          } else {
            throw new Error('Document ID is missing');
          }
        } else {
          throw new Error('No documents found in the collection.');
        }
      })
      .then((url) => {
        setMyImage(url);
      })
      .catch(error => {
        console.error("Error in fetchImage:", error);
      });
  }

  function handleChoice(isAI: boolean) {

    const data = {
      label: isAI,
      id: path,
    }
    addDoc(collection(db, 'labeled'), data)
      .then(() => {
        console.log('Document added to the "results" collection.');
      })
      .catch(error => {
        console.error('Error adding document:', error);
      });
    fetchImage();
  }

  function handleImageLoad() {
    
  }

  return (
    <>
      <img src={myImage} alt="React Logo" className="testImage" onLoad={handleImageLoad} />
      <div className='choiceContainer' >
        <button className="choice" onClick={() => {
          handleChoice(true);
        }}>
          <h1>This is AI</h1>
        </button>
        <button className = "choice" onClick={() => {
          handleChoice(false);
        }}>
          <h1>This is not AI</h1>
        </button>
      </div>
    </>
  )
}

export default App
