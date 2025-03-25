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
    const [submitvalue, setsubmitvalue] = useState(["Submit", false])

    useEffect(() => {
        setrecheckstatus((prev) => !prev)
    }, [extractedData])

    useEffect(() => {
        setimgstatus(filearr.length === 0 ? true : false);
    }, [filearr.length])

    return (
        <FileContext.Provider value={{
            filearr, setfilearr, loadingStates,
            setLoadingStates, extractedData, setExtractedData,
            editstatus, seteditstatus, imgstatus,
            setimgstatus, statusarr, setstatusarr,
            recheckstatus, submitvalue, setsubmitvalue
        }}>
            {children}
        </FileContext.Provider>
    );
};
