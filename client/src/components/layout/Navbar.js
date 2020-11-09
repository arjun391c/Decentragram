import React from 'react'
import styled from 'styled-components'

const Navbar = ({account}) => {
    return (
        <Wrapper>
            <h3 className='title'>Decentragram</h3>
            {account &&
                <div className="right-section">
                    <p>{account}</p>
                    <p className="icon">A</p>
                </div>
            }
        </Wrapper>
    )
}

export default Navbar

const Wrapper = styled.div`
    position: fixed;
    width: 100%;
    z-index: 10;
    height: 6vh;
    background-color: #333;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
        color: #fff;
        letter-spacing: .1rem;
    }
    .right-section {
        color: #fff;
        display: flex;
        flex-direction: row;
        margin-right: 1rem;
        p {
            font-size: 0.8rem;
        }
        .icon {
            background-color: red;
            margin-left: 1rem;
            width: 1.2rem;
            height: 1.2rem;
            text-align: center;
            border-radius: 50%;
            font-weight: bold;
        }
    }
`