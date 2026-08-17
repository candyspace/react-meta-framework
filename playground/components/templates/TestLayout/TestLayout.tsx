import type { CSSProperties } from "react"
import type { TestLayoutProps } from "./types"
import { arr } from "@/util"
import classNames from "classnames"

import scss from "./test-layout.module.scss"

export const TestLayout = ({
    unitNarrow = "1.5lvh",
    unitSquare = "1.5lvh",
    unitWide = "1.5lvh",
    className,
    ...props
}: TestLayoutProps) => {
    return (
        <div
            {...props}
            className={classNames(scss.baseLayout, className)}
            style={{
                "--aspect-unit-narrow": unitNarrow,
                "--aspect-unit-square": unitSquare,
                "--aspect-unit-wide": unitWide,
            } as CSSProperties}
        >
            <h1 className={classNames("rmf-prose", scss.header)}>
                <span>Header</span>
            </h1>
            <div className={scss.panel} />
            <div className={scss.body}>
                {arr(24).map(i => (
                    <div key={i} className={classNames("rmf-prose", scss.card)}>
                        <h2>Card</h2>
                    </div>
                ))}
            </div>
            <footer className={classNames("rmf-prose", scss.footer)}>
                <h3>
                    Footer
                </h3>
            </footer>
        </div>
    )
}
