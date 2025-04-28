import { ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface Props {
    minPrice?: string | null
    maxPrice?: string | null
    onMinPriceChange: (value: string) => void
    onMaxPriceChange: (value: string) => void
}

export const formatAsCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")

    if (!numericValue) return ""

    const numberValue = parseFloat(numericValue)
    if (isNaN(numberValue)) return ""

    const formattedNumber = new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numberValue)

    return `${formattedNumber} ₫`
}

export const PriceFilter = ({
    minPrice, maxPrice, onMinPriceChange, onMaxPriceChange,
}: Props) => {

    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, "")
        onMinPriceChange(value)
    }

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, "")
        onMaxPriceChange(value)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Minimum price
                </Label>
                <Input
                    type="text"
                    placeholder="0"
                    value={minPrice ? formatAsCurrency(minPrice) : ""}
                    onChange={handleMinPriceChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Maximum price
                </Label>
                <Input
                    type="text"
                    placeholder="∞"
                    value={maxPrice ? formatAsCurrency(maxPrice) : ""}
                    onChange={handleMaxPriceChange}
                />
            </div>
        </div>
    )
}
