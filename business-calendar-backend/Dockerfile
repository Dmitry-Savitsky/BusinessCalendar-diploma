FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["BusinessCalendar/BusinessCalendar.Presentation.csproj", "BusinessCalendar/"]
COPY ["BusinessCalendar.Core/BusinessCalendar.Core.csproj", "BusinessCalendar.Core/"]
COPY ["BusinessCalendar.Application/BusinessCalendar.Application.csproj", "BusinessCalendar.Application/"]
COPY ["BusinessCalendar.Infrastructure/BusinessCalendar.Infrastructure.csproj", "BusinessCalendar.Infrastructure/"]
COPY ["BusinessCalendar.Test/BusinessCalendar.Test.csproj", "BusinessCalendar.Test/"]
COPY ["BusinessCalendar.sln", "./"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build -c Release --no-restore

# Publish the application
RUN dotnet publish "BusinessCalendar/BusinessCalendar.Presentation.csproj" -c Release -o /app/publish --no-restore

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Create directory for uploaded images
RUN mkdir -p wwwroot/images

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "BusinessCalendar.Presentation.dll"] 