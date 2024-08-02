const LinkRow = ({link}) => {
    return (
        <tr>
            <td>{link.name}</td>
            <td><a href = {link.link}>Product link</a></td>
            <td>{link.latestPrice}</td>
            <td>{link.updatedAt}</td>
            <td>{link.createdAt}</td>
            <td>Delete Link</td>
        </tr>
    )
}
export default LinkRow