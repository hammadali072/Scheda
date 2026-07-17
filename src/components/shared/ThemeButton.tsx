
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'underline';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    to?: never;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'link';
    to: string;
}

type ThemeButtonProps = (ButtonProps | LinkProps) & {
    variant?: ButtonVariant;
    className?: string;
    primary2?: boolean,
    children: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-b from-primary-start to-primary-end outline-2 outline-primary/40 text-white shadow-inset hover:outline-black/40',
    secondary: 'bg-transparent outline-2 outline-primary/40 text-primary shadow-inset hover:text-white',
    underline: 'bg-transparent pb-2 text-white',
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
    variant = 'primary',
    className = '',
    as = 'button',
    to = '/',
    primary2,
    children,
    ...rest
}) => {


    const defaultTextSize = primary2 ? 'text-sm m:text-base font-semibold' : 'm:text-lg text-base font-semibold';
    const classes = clsx(
        'relative inline-flex items-center justify-center group/button',
        className,
        defaultTextSize,
        variant === 'underline' ? 'py-1 px-0' : primary2 ? 'px-6 py-2 m:py-6' : 'py-2.5 xl:py-3 px-8 xl:px-10',
        primary2 ? 'rounded-md' : (variant !== 'underline') ? 'rounded-full' : 'rounded-none',
        VARIANT_CLASSES[variant],
        'overflow-hidden duration-700 ease-in-out',
    )

    const afterStyles = variant === 'primary' ? 'from-secondary-start to-secondary-end' : 'from-primary-start to-primary-end'

    const inner = (
        <>
            <div className="relative text-current flex flex-col z-10 overflow-hidden">
                <span className="relative translate-y-0 duration-500 group-hover/button:-translate-y-full">
                    {children}
                </span>
                <span className="absolute top-[140%] text-current left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center duration-700 ease-in-out group-hover/button:top-1/2">
                    {children}
                </span>
            </div>
            {
                (variant !== 'underline')
                    ?
                    (<span className={clsx('absolute top-1/2 left-1/2 size-[150px] transform -translate-x-1/2 -translate-y-1/2 rounded-full scale-0 bg-gradient-to-b pointer-events-none', afterStyles, 'transition-transform duration-700 ease-out group-hover/button:scale-[3]')} />)
                    :
                    (<span className="absolute bottom-0 left-0 w-full h-[2px] bg-current duration-500 opacity-80 group-hover/button:opacity-100" />)

            }
        </>
    );

    if (as === 'link') {
        return (
            <Link
                to={to}
                className={classes}
                {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {inner}
            </Link>
        )
    }
    return (
        <button
            className={classes}
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {inner}
        </button>
    )
}

export default ThemeButton