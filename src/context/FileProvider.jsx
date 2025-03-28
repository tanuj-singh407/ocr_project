import { useState } from "react";
import { FileContext } from "./FileContext";

// Provider Component
export const FileProvider = ({ children }) => {
    const [extractedData, setExtractedData] = useState(null);
    const [statusarr, setstatusarr] = useState([])
    const [filearr, setfilearr] = useState([]);
    const [loadingStates, setLoadingStates] = useState([]);
    const [editstatus, seteditstatus] = useState(false)
    const [imgstatus, setimgstatus] = useState(true)
    const [submitvalue, setsubmitvalue] = useState(["Submit", false])
    const [loadingvalue, setloadingvalue] = useState(0);
    const [loadingdata, setloadingdata] = useState('');

    return (
        <FileContext.Provider value={{
            filearr, setfilearr, loadingStates,
            setLoadingStates, extractedData, setExtractedData,
            editstatus, seteditstatus, imgstatus,
            setimgstatus, statusarr, setstatusarr,
            submitvalue, setsubmitvalue, loadingvalue, setloadingvalue, loadingdata, setloadingdata
        }}>
            {children}
        </FileContext.Provider>
    );
};