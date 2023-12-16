import { databases } from "@/appwrite";

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    //check if accumulator has a key as "todo | inprogress | done"
    // if not create one
    if (!acc.has(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    // push data to the specific key (todo | inprogress | done)
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  /*columns = {
        0: {
            key:"todo",
            value: 
                id:"todo"
                todos: [{
                    id:12346,
                    status: "todo",
                    title:"Take dogs for a walk",
                    createdAt:"..."
                },{}...]
        }
        1:{
            key:"inprogress",
            value: 
                id:"inprogress"
                todos: [{
                    id:12346,
                    status: "inprogress",
                    title:"Take dogs for a walk",
                    createdAt:"..."
                },{}...]
            }
        }
    */

  // if columns doesn't have inprogress, todo or done , add them with empty todos so that we always have all 3
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  //sort columns

  // returning logic : The comparison function compares the positions of the keys (a[0] and b[0]) in the columnTypes array. 
  // It subtracts the index of a[0] from the index of b[0], which will result in a negative value if a[0] should come before b[0], 
  // a positive value if a[0] should come after b[0], and 0 if they have the same order in the columnTypes array.
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort((a, b) => {
      return columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]);
    })
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
