import type { BaseProps, KeyOf } from "@/types"
import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite"
import { arr, keysOf, titleCase } from "@/util"
import { DEFAULT_COMPONENT_STATE } from "@/const/state"
import type { FC } from "react"
import classNames from "classnames"

import scss from "./story-tools.module.scss"

export function generateStateStory<T extends BaseProps>(
    meta: Meta<T>,
    options?: {
        states?: (KeyOf<typeof DEFAULT_COMPONENT_STATE> | "idle" | "all")[]
        direction?: "column" | "row"
        copies?: number
    },
): StoryObj<typeof meta> {
    return {
        render: (args: T, _context: StoryContext<T>) => {
            const Component = meta.component as FC<T>
            return (
                <div className={classNames(scss.storyTools, {
                    column: scss.column,
                    row: scss.row,
                }[options?.direction ?? "column"])}
                >
                    {((["idle", ...keysOf(DEFAULT_COMPONENT_STATE)] as (KeyOf<typeof DEFAULT_COMPONENT_STATE> | "idle" | "all")[])
                        .filter(s => !options?.states?.length || options?.states?.includes("all") || options?.states?.includes(s))
                        .map(s => (
                            <div key={s} className={scss.section}>
                                <label
                                    key={`${s}-label`}
                                    className="rmf-prose"
                                >
                                    <span>{titleCase(s)}</span>
                                </label>
                                <div className={scss.components}>
                                    {arr(options?.copies ?? 1).map((_, i) => (
                                        <Component
                                            key={`${s}-${i}`}
                                            {...args}
                                            stateForce={{ [s]: true }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )))}
                </div>
            )
        },
    } as StoryObj<typeof meta>
}
