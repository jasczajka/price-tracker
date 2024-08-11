const LinkRow = ({link, handleDelete}) => {
    const priceAsString = link.latestPrice ? link.latestPrice.toFixed(2) : 'not specified'
    return (
        <tr className={`${link.isPriceSeen === false ? 'new-price' : ''} ${link.priceError ? 'price-error' : ''}`}>
            <td>{link.name}</td>
            <td><a href = {link.link}>Product link</a></td>
            <td>{priceAsString}</td>
            <td>{link.updatedAt.toLocaleString(navigator.language)}</td>
            <td>{link.createdAt.toLocaleString(navigator.language)}</td>
            <td>
                <button onClick={() => handleDelete(link.id)}>
                    X
                </button>
            </td>
        </tr>
    )
}
export default LinkRow