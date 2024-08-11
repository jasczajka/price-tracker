import LinkRow from "./LinkRow"
const LinkTable = ({links, setLinks, handleDelete, handleSort, sortConfig}) => {
    const getSortClass = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? 'sort-up active-sort' : 'sort-down active-sort'
        }
        return ''
    }
    return(
        <table className='link-table'>
            <thead>
                <tr>
                    <th onClick={() => handleSort('name')} className={`sort-button ${getSortClass('name')}`}>Name</th>
                    <th>Link</th>
                    <th onClick={() => handleSort('latestPrice')} className={`sort-button ${getSortClass('latestPrice')}`}>Latest price</th>
                    <th onClick={() => handleSort('updatedAt')} className={`sort-button ${getSortClass('updatedAt')}`}>Price updated</th>
                    <th onClick={() => handleSort('createdAt')} className={`sort-button ${getSortClass('createdAt')}`}>Created</th>
                    <th>Delete</th> 
                </tr>
            </thead>
            <tbody>
                {links.map(link => {
                    return (
                        <LinkRow link = {link} key = {link.id} handleDelete = {handleDelete} />
                    )
                })}
            </tbody>
        </table>
    )
}
export default LinkTable