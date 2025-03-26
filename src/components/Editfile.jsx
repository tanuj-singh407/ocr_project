import React, { useContext, useRef, useState } from "react";
import { FileContext } from "../context/FileContext";

const Editfile = ({ Key }) => {
    const { filearr, setfilearr } = useContext(FileContext);
    const [E_file, setE_file] = useState(null);
    const [E_filedetails, setE_filedetails] = useState(null);
    
    const e_input = useRef(null);

    const e_fileinfo = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileDetails = {
            name: file.name,
            uploadtime: new Date().toLocaleString(), // Ensure this matches Filetable format
        };

        setE_file(file);
        setE_filedetails(fileDetails);
    };
    const edition = () => {
        if (!E_file || !E_filedetails) {
            alert("Please upload a file before saving.");
            return;
        }

        const updatedFileArr = [...filearr];
        updatedFileArr[Key] = [E_filedetails, E_file]; // Ensure correct format
        setfilearr(updatedFileArr);

        e_input.current.value = ""; 
        setE_file('');
        setE_filedetails('');
        document.getElementById('exampleModal').classList.remove('show');
        document.querySelector('.modal-backdrop').remove();
    };

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit File</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form method="POST" encType="multipart/form-data">
                                <input type="file" id="answer_image" name="answer_image" className="mb-0" required onChange={e_fileinfo} ref={e_input} />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={edition}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Editfile;
