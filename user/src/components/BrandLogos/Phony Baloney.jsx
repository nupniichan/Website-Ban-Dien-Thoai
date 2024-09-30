import './Phony Baloney.css';

const PhonyBaloney = () => {
    const letters = ['P', 'H', 'O', 'N', 'E', 'Y', 'B', 'A', 'L', 'O', 'N', 'E', 'Y'];

    return (
        <div className='logo-container'>
            <ul className='logo-ulist'>
                {letters.map((letter, index) => (
                    <li key={index} className='logo-letterlist'>
                        <input type="checkbox" className='logo-letterlist-input'/>
                        <div className='logo-text'>{letter}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PhonyBaloney;
