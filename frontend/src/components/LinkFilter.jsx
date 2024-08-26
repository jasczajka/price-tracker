const LinkFilter = ({filter, setFilter}) => {
    
    return (
        <>
            <p> search &nbsp;
                <input id="filter" 
                    type="text"
                    value={filter}
                    onChange={event => 
                        setFilter(event.target.value)
                    }
                />
            </p>
        
        </>
    )
}

export default LinkFilter