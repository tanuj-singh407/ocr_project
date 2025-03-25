import React, { useRef, useState } from 'react'
import '../index.css'

const Imagecontainer = ({ onFileSubmit }) => {

    const fileinput = useRef(null)

    const [file, setfile] = useState('')

    const [Imagedetails, setImagedetails] = useState({
        name: "",
        uploadtime: ""
    })

    const imageprocessing = (event) => {

        setfile(event.target.files[0])
        const file = event.target.files[0];
        if (file) {
            setImagedetails({
                name: file.name,
                uploadtime: new Date().toLocaleString()
            });
        }
    }

    const handleSubmit = () => {
        if (Imagedetails.name) {
            onFileSubmit(Imagedetails, file)
            setfile("")
            setImagedetails({
                name: "",
                uploadtime: ""
            })
            fileinput.current.value = '';
        }

        else {
            alert("upload an image first")
        }
    }
    return (
        <>
            <div className="container">

                <form id="imagecontainer" method="POST" encType="multipart/form-data">
                    <label htmlFor="answer-image" id='upload_label'>Upload File:</label>
                    <input type="file" id="answer_image" name="answer_image" required onChange={imageprocessing} ref={fileinput} />

                    <button type="button" className="btn btn-primary d-grid form_button" onClick={handleSubmit}> Submit </button>
                </form>

            </div>
        </>
    )
}

export default Imagecontainer
