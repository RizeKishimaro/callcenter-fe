import React from 'react'

type Props = {}

const CallLog = (props: Props) => {
    return (
        <div className='w-full flex flex-col justify-between h-full p-5'>
            <h2 className='uppercase tracking-wider font-semibold text-md'>live progress...</h2>
            <div className="flex flex-col gap-y-3 font-thin lg:text-sm text-xs">
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
                <p>09 123 456 789 inbound | data bla bla JO JO</p>
            </div>
            <button className='capitalize text-btnPrimary text-end text-md tracking-wider font-light pb-3'>view log</button>
        </div>
    )
}

export default CallLog