import Section from "@packages/components/Section";
import { addTodo, deleteTodo, getTodos } from "@packages/repositories/kv/kv";
import { raise } from "@packages/utils/typescript";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";

export async function loader({ context }: LoaderFunctionArgs) {
  console.log({ context });
  const todos = getTodos();

  return { todos };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log({ formData, request });

  if (request.method.toLowerCase() === "delete") {
    const id = formData.get("id")?.toString() ?? raise("Missing id");
    deleteTodo(Number(id));
    return;
  }

  const text = formData.get("text")?.toString() ?? raise("Missing text");

  if (text.length === 0) {
    return new Response("Text cannot be empty", { status: 400 });
  }

  addTodo(text);
}

export default function TodoPage() {
  const { todos } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";

  return (
    <Section>
      <h1 className="text-3xl">Todo</h1>

      <Form method="post" className="join" reloadDocument>
        <input
          className="input join-item"
          type="text"
          name="text"
          placeholder="Enter your task here..."
        />

        <button
          type="submit"
          className="btn btn-outline btn-primary join-item"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>

      <ul className="list-group">
        {todos.map((todo) => (
          <Form key={todo.id} method="delete" className="list-group-item">
            <input type="hidden" name="id" value={todo.id} />
            <span>{todo.text}</span>
            <button type="submit" className="btn btn-outline btn-danger">
              Delete
            </button>
          </Form>
        ))}
      </ul>
    </Section>
  );
}
