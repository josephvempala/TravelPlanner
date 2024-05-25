import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, createLazyFileRoute } from "@tanstack/react-router";
import React from "react";
import { generateAttractions, getAllCities } from "../services/api/attractions";
import { Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: generateAttractions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      Navigate({ to: `/${data.cityId}` });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = formData.get("city") as string;
    mutate(city);
  };

  return (
    <div>
      <h1>Hi there, which city would you like to visit?</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder="Search for a city" />
        <button type="submit">Search</button>
      </form>
      {(isLoading || isPending) && <p>Loading...</p>}
      {isError && <p>An error has occurred while getting cities to visit</p>}
      {data && (
        <ul>
          {data.map((city) => (
            <li key={city.id}>
              <Link to="/$cityId" params={{ cityId: city.id }}>
                {city.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
