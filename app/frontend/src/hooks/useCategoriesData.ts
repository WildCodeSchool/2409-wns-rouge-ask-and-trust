import { GET_CATEGORIES } from "@/graphql/survey/category"
import { useQuery } from "@apollo/client"

export function useCategoriesData() {
	const { data, loading, error } = useQuery(GET_CATEGORIES, {
		fetchPolicy: "cache-first", // avoid useless network requests
	})

	return {
		categoriesData: data,
		isLoadingCategories: loading,
		errorCategories: error,
	}
}
