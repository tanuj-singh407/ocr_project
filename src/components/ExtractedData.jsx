import React, { useContext, useState } from 'react'
import { FileContext } from '../context/FileContext'
import { ScaleLoader } from "react-spinners";
import ni from '../assets/yoyoyoy.jpg'
import Nodata from './nodata';
import axios from 'axios';


const ExtractedData = () => {

    const { loadingStates, extractedData, setExtractedData, statusarr } = useContext(FileContext)
    const [editingindex, seteditingindex] = useState(null);
    const [edittext, setedittext] = useState('')
    const [saveindex, setsaveindex] = useState([]);

    const handlesubmission = async () => {
        console.log("extractedData", extractedData);

        try {
            const response = await axios.post(
                "http://192.168.1.78:5003/submit", extractedData, // Send as JSON object
                { headers: { "Content-Type": "application/json" } } // Set JSON headers
            );
            console.log(response.status);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };




    const editing = (id, text) => {
        seteditingindex(id);
        setedittext(text)
    }
    const handlesave = (id) => {
        setsaveindex((prev) => [...prev, id])

        let temparr = [...extractedData]
        temparr[id].text = edittext
        setExtractedData(temparr)
        seteditingindex('')
        seteditingindex(null)
    }

    return (
        <>
            <div className="container-fluid px-5 qdasboard pt-5">
                <nav className="navbar bg-white text-center">
                    <div className="container-fluid d-block">
                        <span className="navbar-brand mb-0 h1">Question Analysis Dashboard</span>
                    </div>
                </nav>
                {/* {console.log(loadingStates.some(state => state))} */}
                {/* Show loader only when at least one row is in processing */}
                {loadingStates.some(state => state) && (
                    <div className="text-center mt-5">
                        <ScaleLoader />
                        <p>Processing AI recognition...</p>
                    </div>
                )}

                <div className="container-fluid my-4">
                    {!extractedData && <Nodata heading={"No Question Recognised Yet"} para={"You'll get the data here"} imgsrc={ni} />}
                    <div className="row g-4">

                        {extractedData && extractedData?.map((data, idx) => {
                            return (<div className="col-md-6" key={idx}>
                                <div className="card shadow-sm border-0 overflow-hidden">
                                    <div className="card-firsth">
                                        <h5 className="fw-bold card-title card-headings mb-0">Question {idx + 1}</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="fw-bold card-headings">Answer Number</p>
                                        <p className="fw-semibold">Q0{idx + 1}</p>
                                        <hr />
                                        <p className="fw-bold card-headings">Answer Image</p>
                                        <div className="text-center">
                                            <img src={data.image_url} alt="Question" className="img-fluid rounded w-75" />
                                        </div>
                                        <hr />

                                        <p className="fw-bold mt-3 card-headings">Answer Text</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            {editingindex == idx ?
                                                <input type="text" value={edittext} onChange={(e) => { setedittext(e.target.value) }} className='fs-3' /> :
                                                <p className='mb-0 fs-2 font-weight-bold'>{data.text}</p>}

                                            <div className="d-flex justify-content-end gap-3">
                                                {editingindex == idx ?
                                                    <button type="button" className="btn btn-outline-info" onClick={() => { handlesave(editingindex) }}>Save</button> :
                                                    <button type="button" className="btn btn-link text-primary p-0" onClick={() => { editing(idx, data.text) }}>
                                                        <i className="bi bi-pencil me-1"> </i> Edit</button>}
                                                {saveindex.includes(idx) ?
                                                    <button
                                                        type="button"
                                                        className={`btn btn-warning`}
                                                        disabled >
                                                        Updated
                                                    </button> :
                                                    <button
                                                        type="button"
                                                        className={`btn ${statusarr?.[idx]?.verification === "Correct" ? "btn-success" : "btn-danger"}`}
                                                        disabled >
                                                        {statusarr?.[idx]?.verification || "Re-Check Required"}
                                                    </button>}
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="fw-bold card-headings bg-light p-2 rounded border">Image Recognized</p>
                                    </div>
                                </div>
                            </div>
                            )
                        })}{extractedData && <button type="button" className="btn btn-success w-75 mx-auto" onClick={handlesubmission}>Submit</button>}
                    </div>
                </div>

                {/* {<div className="container-fluid my-4">
                    <div className="row g-4">
                        <div className="col-md-6" >
                            <div className="card shadow-sm border-0 overflow-hidden">
                                <div className="card-firsth">
                                    <h5 className="fw-bold card-title card-headings mb-0">Question 1</h5>
                                </div>
                                <div className="card-body">
                                    <p className="fw-bold card-headings">Answer Number</p>
                                    <p className="fw-semibold">Q01</p>
                                    <hr />
                                    <p className="fw-bold card-headings">Answer Image</p>
                                    <div className="text-center">
                                        <img src='..src\assets\Admin Icon.png' alt="Question" className="img-fluid rounded w-75" />
                                    </div>
                                    <hr />
                                    <p className="fw-bold mt-3 card-headings">Answer Text</p>
                                    <div className="d-flex justify-content-between align-items-center">

                                        {editingindex ? <input type="text" value={edittext} onChange={(e) => { setedittext(e.target.value) }} /> : <p className='mb-0'>dsadasdasfdaf</p>}

                                        <div className="d-flex justify-content-end gap-3">
                                            {editingindex ? <button type="button" className="btn btn-outline-info" onClick={() => { handlesave() }}>Save</button> : <button type="button" className="btn btn-link text-primary p-0" onClick={() => { editing(1, "yoyoy") }}>
                                                <i className="bi bi-pencil me-1"> </i> Edit</button>}
                                        </div>
                                    </div>
                                    <hr />
                                    <p className="fw-bold card-headings bg-light p-2 rounded border">Image Recognized</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>} */}

            </div>
        </>
    )
}

export default ExtractedData
