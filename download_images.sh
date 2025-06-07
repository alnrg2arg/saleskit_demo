#!/bin/bash
images=(
    "ai-gement-2.png"
    "basil-chart-pie-solid.svg"
    "bi-caret-down-fill.svg"
    "caret-down-2.svg"
    "group.png"
    "hugeicons-ai-content-generator-01-2.svg"
    "image-1-1.png"
    "image-2-1.png"
    "image-26-1.png"
    "image-45.png"
    "ix-product-management.svg"
    "line-14.svg"
    "lucide-equal.svg"
    "mask-group-2.png"
    "mask-group-3.png"
    "material-symbols-arrows-more-up-rounded.svg"
    "react-icons-aioutlinefilesearch.svg"
    "react-icons-aioutlinesetting.svg"
    "react-icons-pibuildingoffice.svg"
    "ri-chat-ai-fill.svg"
    "search.svg"
    "user.png"
    "vscode-icons-file-type-excel2-1.svg"
)

for img in "${images[@]}"; do
    echo "Downloading $img..."
    curl -s "https://saleskit-react.web.app/img/$img" -o "public/img/$img"
done 