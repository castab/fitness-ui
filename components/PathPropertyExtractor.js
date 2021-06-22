import { cloneElement } from 'react';
import { useRouter } from 'next/router';

export default function PathPropertyExtractor(props) {
    const { property, children } = props;
    if (children == null) return null;
    const router = useRouter();
    const extracted = router.query[property];
    if (extracted == null || extracted == 'undefined') return null;
    let ids = 0;
    if (Array.isArray(children))
        return children.map((child) => cloneElement(child, { [property]: extracted, key: ids++ }));
    return cloneElement(children, { [property]: extracted });
}
