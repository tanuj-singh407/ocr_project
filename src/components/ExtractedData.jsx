import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from '../context/FileContext';
import ni from '../assets/yoyoyoy.jpg';
import Nodata from './nodata';
import axios from 'axios';
import socket from '../Socket';

const ExtractedData = () => {
    const { loadingStates, extractedData, setExtractedData,
        statusarr, submitvalue, setsubmitvalue,
        loadingvalue, setloadingvalue, loadingdata,
        setloadingdata } = useContext(FileContext);

    const [editingindex, seteditingindex] = useState(null);
    const [edittext, setedittext] = useState('');
    const [saveindex, setsaveindex] = useState([]);
    const [showIncorrects, setShowIncorrects] = useState(false);


    useEffect(() => {

        // Connection events
        socket.on("connect", () => console.log("Connected"));

        // Listen for progress updates
        socket.on("progress", (data) => {
            setloadingdata(prev => data.step);
            setloadingvalue(prev => data.progress_percent);
        });

        socket.on("disconnect", () => console.log("Disconnected"));

        return () => {
            // Proper cleanup
            socket.off("progress");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    // Function to handle submission
    const handlesubmission = async () => {

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/submit/submit`, extractedData,
                { headers: { "Content-Type": "application/json" } }
            );
            { response.status == 200 ? setsubmitvalue(["Submitted", true]) : setsubmitvalue(["error in sending", false]) }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    // Edit text handling
    const editing = (id, text) => {
        seteditingindex(id);
        setedittext(text);
    };

    const handlesave = (id) => {
        setsaveindex((prev) => [...prev, id]);

        let temparr = [...extractedData];
        temparr[id].text = edittext;
        setExtractedData(temparr);
        seteditingindex(null);
        setsubmitvalue(["Submit", false]);
    };

    // Filter data to show incorrect items first when needed
    const sortedData = showIncorrects
        ? [...extractedData]?.sort((a, b) => {
            const aStatus = statusarr?.[extractedData.indexOf(a)]?.verification;
            const bStatus = statusarr?.[extractedData.indexOf(b)]?.verification;
            return (aStatus === "Incorrect" ? -1 : 1) - (bStatus === "Incorrect" ? -1 : 1);
        })
        : extractedData;

    return (
        <>
            <div className="container-fluid px-5 qdasboard pt-5">
                <nav className="navbar bg-white text-center">
                    <div className="container-fluid d-flex justify-content-between gap-1rem">
                        <span className="navbar-brand mb-0 h1">Question Analysis Dashboard</span>
                        <button
                            className={`btn ${showIncorrects ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => setShowIncorrects(!showIncorrects)}
                            disabled={statusarr.length == 0}
                        >
                            {showIncorrects ? "Show All" : "Show Incorrects"}
                        </button>
                    </div>
                </nav>

                {loadingStates.some(state => state) && (
                    <>
                        <div className="position-relative text-center mt-5 progress w-75 mx-auto" style={{ height: "27px" }}>
                            <div className="position-absolute w-100 fw-bolder fs-6" style={{ width: `100%`, borderRadius: "20px", zIndex: "999" }}>{loadingvalue}%</div>

                            <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadingvalue}%`, borderRadius: "20px" }}></div>
                        </div>
                        <p className='my-4 text-center'>{loadingdata}</p>
                    </>
                )}


                <div className="container-fluid my-4">
                    {!extractedData && <Nodata heading={"No Question Recognised Yet"} para={"You'll get the data here"} imgsrc={ni} />}
                    <div className="row g-4">

                        {sortedData && sortedData.map((data) => {
                            const originalIndex = extractedData.indexOf(data);
                            const verificationStatus = statusarr?.[originalIndex]?.verification;

                            return (
                                <div className="col-md-6" key={originalIndex}>
                                    <div className="card shadow-sm border-0 overflow-hidden">
                                        <div className="card-firsth">
                                            <h5 className="fw-bold card-title card-headings mb-0">Question {originalIndex + 1}</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="fw-bold card-headings">Answer Number</p>
                                            <p className="fw-semibold">0{originalIndex + 1}</p>
                                            <hr />
                                            <p className="fw-bold card-headings">Answer Image</p>
                                            <div className="text-center">
                                                <img src={data.image_url} alt="Question" className="img-fluid rounded w-75" />
                                            </div>
                                            <hr />

                                            <p className="fw-bold mt-3 card-headings">Answer Text</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {editingindex === originalIndex ? (
                                                    <input type="text" value={edittext} onChange={(e) => { setedittext(e.target.value) }} className='fs-3' />
                                                ) : (
                                                    <p className='mb-0 fs-2 font-weight-bold'>{data.text}</p>
                                                )}

                                                <div className="d-flex justify-content-end gap-3">
                                                    {editingindex === originalIndex ? (
                                                        <button type="button" className="btn btn-outline-info" onClick={() => { handlesave(originalIndex) }}>Save</button>
                                                    ) : (
                                                        <button type="button" className="btn btn-link text-primary p-0" onClick={() => { editing(originalIndex, data.text) }}>
                                                            <i className="bi bi-pencil me-1"></i> Edit
                                                        </button>
                                                    )}

                                                    {saveindex.includes(originalIndex) ? (
                                                        <button type="button" className="btn btn-warning" disabled>
                                                            Updated
                                                        </button>
                                                    ) : (
                                                        verificationStatus && (
                                                            <button
                                                                type="button"
                                                                className={`btn ${verificationStatus === "Correct" ? "btn-success" : "btn-danger"}`}
                                                                disabled>
                                                                {verificationStatus}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="fw-bold card-headings bg-light p-2 rounded border">Image Recognized</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {extractedData && <button type="button" className="btn btn-success w-75 mx-auto mt-4" onClick={handlesubmission} disabled={submitvalue[1]}>
                            {submitvalue[0]}
                        </button>}
                    </div>
                </div>
            </div >
        </>
    );
};

export default ExtractedData;
