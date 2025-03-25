import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { FileContext } from "../context/FileContext";
import Nodata from "./nodata";

const Filetable = ({ fileData, Editkey }) => {
    const { filearr, setfilearr, loadingStates, setLoadingStates, setExtractedData, imgstatus, setimgstatus, setstatusarr, setsubmitvalue } = useContext(FileContext);

    const [recheckStates, setRecheckStates] = useState([]); // Manage Re-Check button states

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
            const response = await axios.post("http://192.168.1.78:5000/extract-text", formdata);
            setExtractedData([...response.data.extracted_data]); // Set extracted data
            setRecheckStates(prev => prev.map((state, i) => (i === id ? false : state))); // Enable Re-Check
            setstatusarr([])

        } catch (error) {
            console.error("Error calling API:", error);
            alert("Failed to start AI recognition.");
        } finally {
            setLoadingStates(prev => prev.map((state, i) => (i === id ? false : state)));
        }
    };

    const gettingstatus = async (idx) => {
        if (!filearr[idx]) {
            alert("No file data available!");
            return;
        }

        setRecheckStates(prev => prev.map((state, i) => (i === idx ? "checking" : state))); // Show "Checking..."

        try {
            const response = await axios.get("http://192.168.1.78:5002/verify-japanese");
            setstatusarr(response.data.results);
            setsubmitvalue(["Submit", false]);
            setRecheckStates(prev => prev.map((state, i) => (i === idx ? false : state))); // Re-enable Re-Check after API call

        } catch (error) {
            console.error("Error calling Status API:", error);
            alert("Failed to start Status recognition.");
            setRecheckStates(prev => prev.map((state, i) => (i === idx ? false : state))); // Ensure button is enabled even on error
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
            </div>
        </>
    );
};

export default Filetable;
