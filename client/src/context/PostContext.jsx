import { createContext } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { useMemo } from "react";

const Context = createContext()

export function usePost() {
	return useContext(Context)
}

export function PostProvider({children}) {

	const {id} = useParams()

	const { loading, error, value: post} = useAsync(() => getPost(id), [id])

	const commentsByParentId = useMemo(() => {

		if (post?.comments == null) return []

		const group = {}

		post.comments.forEach(comment => {
			group[comment.parentId] ||= []
			group[comment.parentId].push(comment)
		})

		return group

	}, [post?.comments]) 

	function getReplies(parentId) {
		return commentsByParentId[parentId]
	}

	return <Context.Provider value ={{ post: { id, ...post}, getReplies, rootComments: commentsByParentId[null] }}>
		{ loading ? ( <h1>Loading</h1>) : error ? (<h1 className="error-msg">{error}</h1>) : (children) }
	</Context.Provider>
}