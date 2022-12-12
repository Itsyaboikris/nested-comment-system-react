import { createContext } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";

const Context = createContext()

export function PostProvider({children}) {

	const {id} = useParams()

	const { loading, error, value: post} = useAsync(() => getPost(id), [id])

	console.log(post)

	return <Context.Provider value ={{ post: { id, ...post} }}>
		{ loading ? ( <h1>Loading</h1>) : error ? (<h1 className="error-msg">{error}</h1>) : (children) }
	</Context.Provider>
}