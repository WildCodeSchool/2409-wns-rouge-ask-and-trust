import { GET_CATEGORIES } from "@/graphql/survey/category"
import { useQuery } from "@apollo/client"

type GetCategoriesQuery = {
	categories: {
		id: string
		name: string
		createdAt: string
		updatedAt: string
	}[]
}

/**
 * Hook to fetch survey categories.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch survey categories.
 * It returns the categories data, loading state, and error if any.
 * The `cache-first` fetch policy is used to avoid unnecessary network requests.
 *
 * @returns {Object} An object containing the categories data and query state.
 *
 * @property {GetCategoriesQuery | undefined} categoriesData - The categories returned by the query.
 * @property {boolean} isLoadingCategories - True if the query is loading.
 * @property {Error | undefined} errorCategories - The error object if the query fails.
 *
 * @example
 * ```ts
 * const { categoriesData, isLoadingCategories, errorCategories } = useCategoriesData();
 *
 * if (isLoadingCategories) return <p>Loading categories...</p>;
 * if (errorCategories) return <p>Error: {errorCategories.message}</p>;
 *
 * return (
 *   <ul>
 *     {categoriesData?.categories.map(category => (
 *       <li key={category.id}>{category.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useCategoriesData() {
	const { data, loading, error } = useQuery<GetCategoriesQuery>(
		GET_CATEGORIES,
		{
			fetchPolicy: "cache-first",
		}
	)

	return {
		categoriesData: data,
		isLoadingCategories: loading,
		errorCategories: error,
	}
}
