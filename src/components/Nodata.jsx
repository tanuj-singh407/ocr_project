import React from 'react'
import NoDataImage from '/src/assets/nodata.jpg'

const Nodata = ({ heading, para, imgsrc }) => {
    return (
        <>
            <div className="container text-center pt-3">
                <img src={imgsrc || NoDataImage} alt="nodata-image" className='no_data_img'/>
                <h4 className='blockquote mt-3'>{heading || 'No Data Available'} </h4>
                <p className='text-muted'>{para || "There is no available data to show. please choose file."}</p>
            </div>
        </>
    )
}

export default Nodata
