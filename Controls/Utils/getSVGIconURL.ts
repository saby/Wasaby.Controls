export function getSVGIconURL(url: string): string {
    if (isSVGIcon(url)) {
        const [fileName, icon]: string[] = url.split('/');
        return `/cdn/icons/${fileName}#${icon}`;
    } else {
        return url;
    }
}

export function isSVGIcon(icon: string): boolean {
    return !!icon && icon.includes('/');
}
