import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary'| 'danger' | 'text'
}


const Button = ({ onClick, disabled, children, variant = 'primary', ...rest }: ButtonProps) => {
    let className = 'w-full px-4 py-2 rounded-md ';

    if (variant === 'primary') {
        className += 'bg-blue-700 text-white hover:bg-blue-800';
    }
    else if (variant === 'secondary') {
        className += 'bg-gray-400 text-gray-900 hover:bg-gray-500 hover:text-gray-200';
    }
    else if (variant === 'danger') {
        className += 'bg-red-500 text-white hover:bg-red-600';
    }
    else {
        className += 'text-blue-700'
    }

    return (<>
        <button className={className} {...rest} onClick={onClick}>
            {children}
        </button>
    </>
    )
}
export default Button;