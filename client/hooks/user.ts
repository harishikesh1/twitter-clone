import { graphQLClient } from "@/client/api"
import { getCurrentUser, getUserByIdQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"
 

export const userCurrentUser = ()=>{
    const query = useQuery({
        queryKey:["current-user"],
        queryFn: ()=> graphQLClient.request(getCurrentUser)
    })

    return {...query, user: query.data?.getCurrentUser}
}

export const useGetUserById = (id: string)=>{
    const query = useQuery({
        queryKey:["user-by-id", id],
        queryFn: ()=> graphQLClient.request(getUserByIdQuery, {id} ),
        enabled: !!id,
    })

    return {...query, user: query.data?.getUserById}
}

 