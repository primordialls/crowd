import { useState } from 'react'
import { app } from './main.tsx'
import './App.css'
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react'

function App() {
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [myImage, setMyImage] = useState("200w.gif");
  const [path, setPath] = useState('');
  const [truth, setTruth] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchImage()
  }, [])

  // Fetch image URL from Firebase Storage
  function fetchImage(customIndex?: number) {
    const indexToUse = customIndex !== undefined ? customIndex : index;
    const randomCollectionRef = collection(db, 'trainimg');
    
    getDocs(randomCollectionRef)
      .then(querySnapshot => {
        const docs = querySnapshot.docs;
        if (docs.length > 0) {
          const firstDoc = docs[indexToUse % docs.length];
          const doc = firstDoc.data();
          console.log(doc);
          // Access doc.id here inside the promise chain
          if (doc && doc.id) {
            const imageRef = ref(storage, doc.id);
            setPath(doc.id);
            setTruth(doc.truth);
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
    const newIndex = index + 1;
    setIndex(newIndex);
    const docRef = doc(db, 'labeled', path);
    getDoc(docRef)
      .then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentLabels = data.labeled || [];
        return updateDoc(docRef, {
          labeled: [...currentLabels, isAI],
        });
      } else {
        return setDoc(docRef, {
          labeled: [isAI],
          truth: truth,
        });
      }
      })
      .then(() => {
        console.log('Document processed in the "labeled" collection.');
      })
      .catch(error => {
        console.error('Error processing document:', error);
      });
    fetchImage(newIndex);
  }

  function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    if (event.currentTarget instanceof HTMLImageElement) {
      event.currentTarget.classList.remove('refresh-animation');
      void event.currentTarget.offsetWidth; // Trigger reflow to restart animation
      event.currentTarget.classList.add('refresh-animation');
    }
  }

  return (
    <>
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <label htmlFor="indexInput">Set Index:</label>
        <input
          id="indexInput"
          type="number"
          value={index}
          onChange={(e) => { setIndex(Number(e.target.value)) }}
          style={{ marginLeft: '0.5rem' }}
        />
        <button style={{ marginLeft: '1rem' }} onClick={() => fetchImage()}>Fetch New Image</button>
      </div>
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
