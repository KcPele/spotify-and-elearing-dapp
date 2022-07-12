import React, {createContext, useReducer} from 'react'

export const nftContext = createContext()

const contentReducer = (state, action) => {
    switch (action.type) {
      case ADD_TRACK:
           return state.tracks = [...state.tracks, action.payload]
      case ADD_COURSE:
          return state.courses = [...state.courses, action.payload]
      default:
        return state;
    }
}

const NftContextProvider = ({children}) => {
    const [content, dispatch] = useReducer(contentReducer, {tracks: [
      {
        title: "Heart",
        artist: "Adele",
        audioSrc: "https://www.computerhope.com/jargon/m/example.mp3",
        image: "https://media.istockphoto.com/photos/concert-stage-on-rock-festival-music-instruments-silhouettes-picture-id1199243596?k=20&m=1199243596&s=612x612&w=0&h=5L3fWhbB4YtVOPsnnqrUg22FaHnSGVCjkrG79wB31Tc=",
        color: "orange",
      }
    ], courses: []})

  //set tracks to localStorage
  //use reducers to add the tracts from the graph
    const {tracks, courses} = content

    
  return (
    <nftContext.Provider value={{  tracks, dispatch, courses }}>
      {children}
    </nftContext.Provider>
  )
}

export default NftContextProvider