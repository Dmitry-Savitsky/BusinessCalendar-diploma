FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["BusinessCalendar/BusinessCalendar.Presentation.csproj", "BusinessCalendar/"]
COPY ["BusinessCalendar.Core/BusinessCalendar.Core.csproj", "BusinessCalendar.Core/"]
COPY ["BusinessCalendar.Application/BusinessCalendar.Application.csproj", "BusinessCalendar.Application/"]
COPY ["BusinessCalendar.Infrastructure/BusinessCalendar.Infrastructure.csproj", "BusinessCalendar.Infrastructure/"]
COPY ["BusinessCalendar.Test/BusinessCalendar.Test.csproj", "BusinessCalendar.Test/"]
COPY ["BusinessCalendar.sln", "./"]

# Clear NuGet cache and restore packages with force
RUN dotnet nuget locals all --clear
RUN dotnet restore --force-evaluate

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build -c Release

# Publish the application
RUN dotnet publish "BusinessCalendar/BusinessCalendar.Presentation.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install and configure timezone data
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Minsk /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

COPY --from=build /app/publish .

# Create directory for uploaded images
RUN mkdir -p wwwroot/images

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "BusinessCalendar.Presentation.dll"] 