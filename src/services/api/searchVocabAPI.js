import apiClient from "./client";
import cookies from "js-cookie";

const getCurrentLocale = () => cookies.get("i18next") || "en";

const transformItem = (item) => {
    const categoryGroup = item.category_group || {};
    return {
        id: item.id,
        kumpulanKategori:
            categoryGroup.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
        groupCategory:
            categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
        word: item.Word || "",
        perkataan: item.Perkataan || "",
        video: item.Video || "",
        imgStatus: item.Image_Status || "",
        exampleSentence: item.Example_Sentence || "",
        contohAyat: item.Contoh_Ayat || "",
    };
};

const dedupe = (arr) => {
    const seen = new Set();
    const out = [];

    for (const item of arr) {
        const key = `${item.word}|${item.perkataan}|${item.groupCategory}`;
        if (!seen.has(key)) {
            seen.add(key);
            out.push(item);
        }
    }

    return out;
};

export const searchVocabs = async (query) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const locale = getCurrentLocale();
    const field = locale === "ms" ? "Perkataan" : "Word";
    const encoded = encodeURIComponent(trimmed);

    const eqUrl = `/api/bims?populate=category_group&filters[${field}][$eqi]=${encoded}&pagination[pageSize]=1`;
    const startsUrl = `/api/bims?populate=category_group&filters[${field}][$startsWithi]=${encoded}&pagination[pageSize]=50`;

    const [eqRes, startsRes] = await Promise.all([
        apiClient.get(eqUrl),
        apiClient.get(startsUrl),
    ]);

    const exactItems = eqRes.data?.data?.map(transformItem) ?? [];
    const prefixItems = startsRes.data?.data?.map(transformItem) ?? [];

    const sortByLocale = (items) =>
        items.slice().sort((a, b) =>
            locale === "ms"
                ? a.perkataan.localeCompare(b.perkataan)
                : a.word.localeCompare(b.word)
        );

    const sortedExact = sortByLocale(exactItems);
    const sortedPrefix = sortByLocale(prefixItems);

    let combined = dedupe([...sortedExact, ...sortedPrefix]);

    if (combined.length < 50) {
        const containsUrl = `/api/bims?populate=category_group&filters[${field}][$containsi]=${encoded}&pagination[pageSize]=50`;
        const containsRes = await apiClient.get(containsUrl);
        const containsItems = containsRes.data?.data?.map(transformItem) ?? [];
        const sortedContains = sortByLocale(containsItems);
        combined = dedupe([...combined, ...sortedContains]);
    }

    return combined;
};
