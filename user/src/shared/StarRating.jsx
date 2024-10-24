import styled from "styled-components";

const Radio = () => {
    return (
        <StyledWrapper>
            <div className="rating">
                <input type="radio" id="star5" name="rate" value="5" />
                <label htmlFor="star5" title="text" />
                <input type="radio" id="star4" name="rate" value="4" />
                <label htmlFor="star4" title="text" />
                <input type="radio" id="star3" name="rate" value="3" />
                <label htmlFor="star3" title="text" />
                <input type="radio" id="star2" name="rate" value="2" />
                <label htmlFor="star2" title="text" />
                <input
                    checked={true}
                    type="radio"
                    id="star1"
                    name="rate"
                    value="1"
                />
                <label htmlFor="star1" title="text" />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .rating:not(:checked) > input {
        position: absolute;
        appearance: none;
    }

    .rating:not(:checked) > label {
        float: right;
        cursor: pointer;
        font-size: 30px;
        color: #666;
    }

    .rating:not(:checked) > label:before {
        content: "★";
    }

    .rating > input:checked + label:hover,
    .rating > input:checked + label:hover ~ label,
    .rating > input:checked ~ label:hover,
    .rating > input:checked ~ label:hover ~ label,
    .rating > label:hover ~ input:checked ~ label {
        color: #e58e09;
    }

    .rating:not(:checked) > label:hover,
    .rating:not(:checked) > label:hover ~ label {
        color: #ff9e0b;
    }

    .rating > input:checked ~ label {
        color: #ffa723;
    }
`;

export default Radio;
