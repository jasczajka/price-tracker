import ColorTooltip from "./ColorTooltip"
const LogoutPanel = ({handleLogout, user}) => {
    return(
        <div className='logout-panel'>
            <h3>logged as {user.username}</h3>
            <ColorTooltip />
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default LogoutPanel