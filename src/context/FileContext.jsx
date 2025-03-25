import { createContext, useEffect, useState } from "react";

// Create Context
export const FileContext = createContext();

// Provider Component
export const FileProvider = ({ children }) => {
    const [extractedData, setExtractedData] = useState(null);
    const [statusarr, setstatusarr] = useState([])
    const [filearr, setfilearr] = useState([]);
    const [loadingStates, setLoadingStates] = useState([]);
    const [editstatus, seteditstatus] = useState(false)
    const [imgstatus, setimgstatus] = useState(true)
    const [recheckstatus, setrecheckstatus] = useState(true);

    useEffect(() => {
        setrecheckstatus((prev) => !prev)
        // console.log(recheckstatus)   
    }, [extractedData])

    useEffect(() => {
        setimgstatus(filearr.length === 0 ? true : false);
    }, [filearr.length])

    // useEffect(() => {
    //     console.log("Updated statusarr:", statusarr); // Logs when statusarr updates
    // }, [statusarr]);

    return (
        <FileContext.Provider value={{
            filearr, setfilearr, loadingStates,
            setLoadingStates, extractedData, setExtractedData,
            editstatus, seteditstatus, imgstatus,
            setimgstatus, statusarr, setstatusarr,
            recheckstatus
        }}>
            {children}
        </FileContext.Provider>
    );
};
