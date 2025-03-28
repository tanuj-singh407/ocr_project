import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { FileContext } from "../context/FileContext";
import Nodata from "./nodata";

const Filetable = ({ fileData, Editkey }) => {
    const { filearr, setfilearr, loadingStates, setLoadingStates, setExtractedData, imgstatus, setimgstatus, statusarr, setstatusarr, setsubmitvalue,
        loadingvalue, setloadingvalue, loadingdata, setloadingdata
    } = useContext(FileContext);

    const [recheckStates, setRecheckStates] = useState([]); // Manage Re-Check button states
    const [loading, setLoading] = useState(false);
    const [translateValue, setTranslateValue] = useState(0);


    useEffect(() => {
        setimgstatus(filearr.length === 0 ? true : false);
    }, [filearr.length])

    useEffect(() => {
        if (fileData[0] != null) {
            setfilearr((prevFiles) => [...prevFiles, fileData]); // Add new file
            setLoadingStates((prev) => [...prev, false]); // Initialize loading state
            setRecheckStates((prev) => [...prev, true]); // Initially disable Re-Check
        }
    }, [fileData[0]]);

    const deletefile = (idx) => {
        setfilearr(filearr.filter((_, inx) => inx !== idx));
        setLoadingStates(loadingStates.filter((_, inx) => inx !== idx));
        setRecheckStates(recheckStates.filter((_, inx) => inx !== idx)); // Remove Re-Check state
    };

    const extraction = async (id) => {
        if (!filearr[id]) {
            alert("No file data available!");
            return;
        }

        setLoadingStates(prev => prev.map((state, i) => (i === id ? true : state)));
        setExtractedData(null); // Clear previous data

        try {
            const formdata = new FormData();
            formdata.append("file", filearr.find((_, idx) => idx == id)?.[1]);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/extract/extract-text`, formdata);
            setExtractedData([...response.data.extracted_data]); // Set extracted data
            setRecheckStates(prev => prev.map((state, i) => (i === id ? false : state))); // Enable Re-Check
            setstatusarr([])

        } catch (error) {
            console.error("Error calling API:", error);
            alert("Failed to start AI recognition.");
        } finally {
            setLoadingStates(prev => prev.map((state, i) => (i === id ? false : state)));
            setloadingvalue(0)
            setloadingdata('')
        }
    };

    useEffect(() => {
        if (loading) {
            setTranslateValue(0); // Reset progress

            const interval = setInterval(() => {
                setTranslateValue((prevValue) => {
                    const increment = Math.floor(Math.random() * 4 + 4);
                    const newValue = prevValue + increment;
                    return newValue >= 97 ? 97 : newValue; // Ensure it never exceeds 100
                });
            }, 900);

            return () => clearInterval(interval);
        }
    }, [loading]);



    const gettingstatus = async (idx) => {
        if (!filearr[idx]) {
            alert("No file data available!");
            return;
        }

        setTranslateValue(0); // Reset progress first
        setLoading(true);


        setRecheckStates(prev => prev.map((state, i) => (i === idx ? "checking" : state))); // Show "Checking..."

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify/verify-japanese`);
            setstatusarr(response.data.results);
            setsubmitvalue(["Submit", false]);
            setRecheckStates(prev => prev.map((state, i) => (i === idx ? false : state))); // Re-enable Re-Check after API call

        } catch (error) {
            console.error("Error calling Status API:", error);
            alert("Failed to start Status recognition.");
            setRecheckStates(prev => prev.map((state, i) => (i === idx ? false : state))); // Ensure button is enabled even on error
        } finally {
            setLoading(false);
            setTranslateValue(100);
        }
    };

    return (
        <>
            <div className="container-fluid px-5 pb-5 filetable">
                <table className="table">
                    <thead>
                        <tr className="filerow">
                            <th scope="col" className="bg-transparent">File Name</th>
                            <th scope="col" className="bg-transparent">Upload Info</th>
                            <th scope="col" className="bg-transparent">AI Recognition</th>
                            <th scope="col" className="bg-transparent">Status</th>
                        </tr>
                    </thead>

                    <tbody className="tablebody">
                        {filearr?.map((data, idx) => {
                            return (
                                <tr className="filerow" key={idx}>
                                    <td><i className="bi bi-file-earmark-text me-2 fs-4"></i>{data[0]?.name}</td>
                                    <td><i className="bi bi-calendar-check me-2 fs-4"></i> {data[0]?.uploadtime}</td>
                                    <td>
                                        <div className="ftablebtn d-flex align-items-center gap-3">
                                            <button type="button"
                                                className="btn btn-outline-primary btn-editable"
                                                onClick={() => { extraction(idx) }}
                                                disabled={loadingStates[idx]} >
                                                {loadingStates[idx] ? "Processing..." : "START"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                disabled={recheckStates[idx] === true}
                                                onClick={() => { gettingstatus(idx) }}
                                            >
                                                <i className="bi bi-check"></i>
                                                {recheckStates[idx] === "checking" ? "Checking..." : "Re-Check"}
                                            </button>
                                        </div>
                                    </td>
                                    <td id="ftabledata" className="ftablebtn">
                                        <div className="ftablebtn d-flex align-items-center gap-3">
                                            <button type="button" className="btn btn-link text-primary p-0" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { Editkey(idx) }}><i className="bi bi-pencil me-1"></i> Edit</button>
                                            <button type="button" className="btn btn-link text-danger p-0" onClick={() => { deletefile(idx) }}> <i className="bi bi-trash me-1"></i> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {imgstatus && <Nodata />}

                {loading ?
                    <><div className="progress position-relative w-50 h-4 bg-white border border-dark rounded-3 overflow-hidden mx-auto" style={{ height: "27px" }}>
                        <div
                            className="progress-bar bg-success h-100 rounded-3 transition-all duration-500 ease-in-out"
                            role="progressbar"
                            style={{ width: `${translateValue}%` }}
                            aria-valuemin="0"
                            aria-valuemax="100">

                        </div>
                        <span className="position-absolute z-3 start-50 top-0 translate-middle-x mt-n1 text-dark fw-bold fs-6">
                            {translateValue}%
                        </span>
                    </div></>
                    : ""}
            </div>
        </>
    );
};

export default Filetable;
