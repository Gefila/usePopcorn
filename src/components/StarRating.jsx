const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap:'16px'
}

const starContainerStyle = {
    display: 'flex',
    gap: '4px'
}

const textStyle = {
    margin: 0,
    lineHeight: 1
}

export default function StarRating({maxRating=5}) {
    return(
        <div style={containerStyle}>
            <div style={starContainerStyle}>
                {Array.from({length: maxRating}, (_, i)=> (
                    <span key={i}>s{i+1} </span>
                ))}
            </div>
            <p style={textStyle}>10</p>
        </div>       
    )
}