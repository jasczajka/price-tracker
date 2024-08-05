
const LinkRow = ({link, handleDelete}) => {

    return (
        <tr>
            <td>{link.name}</td>
            <td><a href = {link.link}>Product link</a></td>
            <td>{link.latestPrice}</td>
            <td>{link.updatedAt.toLocaleString(navigator.language)}</td>
            <td>{link.createdAt.toLocaleString(navigator.language)}</td>
            <td>
                <button onClick={() => handleDelete(link.id)}>
                    Delete
                </button>
            </td>
        </tr>
    )
}
export default LinkRow