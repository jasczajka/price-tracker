import { Tooltip } from "react-tooltip"
const ColorTooltip = () => {
    return (
        <>
            <a 
                data-tooltip-id = 'color-tooltip' 
                data-tooltip-place="top"
                className="color-tooltip-link"
            >
            color guide
            </a>
            <Tooltip id='color-tooltip'>
                <div className='tooltip-content'>
                    <span className='new-price'>New price</span>
                    <br/>
                    <span className='price-error'>Price error</span>
                </div>
            </Tooltip>
        </>
    )
}
export default ColorTooltip