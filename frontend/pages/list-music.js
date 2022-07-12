import React, { useState } from "react"
import { UploadMusic, Music, AudioPlayer } from "../components"
import { useMoralis } from "react-moralis"
import songs from "../data/songs.json"
const ListMusic = () => {
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const { isWeb3Enabled } = useMoralis()
    return (
        
          <div className="container mx-auto">
            {isWeb3Enabled ? (
              <div className="flex gap-4">
                 <div className="my-4">
                    <AudioPlayer />
                </div>
                <div className=" flex flex-col justify-start">
                <div className="my-4 ">
                    <button
                    type="button"
                        className="bg-blue-500 text-white rounded-full px-3 py-2"
                        onClick={() => setShowModal(true)}
                    >
                        {" "}
                        Upload Music
                    </button>
                    <UploadMusic isVisible={showModal} onClose={hideModal} />
                </div>
                
                <div className="flex gap-6 flex-wrap">
                    {songs.map(song => {
                      return <Music key={song.id} {...song}/>
                    })}
                </div>
                </div>
               
              </div>
        
            ) : (
                <div>
                    <h3>Not connected</h3>
                </div>
            )}
        </div>
    )
}

export default ListMusic
