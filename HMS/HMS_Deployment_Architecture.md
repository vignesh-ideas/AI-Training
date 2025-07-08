# HMS Deployment Architecture

## Overview

The Hospital Management System (HMS) deployment architecture is designed for AWS cloud platform with scalability, reliability, and maintainability. It follows a microservices-based approach with containerization and orchestration for production-ready deployment.

## AWS Deployment Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HMS AWS DEPLOYMENT ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AWS ALB       │    │   API Gateway   │    │  Service Mesh   │
│   (Application  │    │   (Gateway)     │    │   (Istio)       │
│   Load Balancer)│    │                 │    │                 │
│                 │    │                 │    │                 │
│  SSL Termination│───▶│  Route Requests │───▶│  Service-to-Service│
│  Health Checks  │    │  Rate Limiting  │    │  Communication  │
│  Load Balancing │    │  Authentication │    │  Circuit Breaker│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Patient Service │    │Appointment Service│
│  (ECS Fargate)  │    │  (ECS Fargate)  │    │  (ECS Fargate)  │
│                 │    │                 │    │                 │
│  Port: 8081     │    │  Port: 8082     │    │  Port: 8083     │
│  Replicas: 3    │    │  Replicas: 3    │    │  Replicas: 3    │
│  Memory: 1GB    │    │  Memory: 1GB    │    │  Memory: 1GB    │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Medical Records  │    │ Vitals Service  │    │  Lab Service    │
│   Service       │    │                 │    │                 │
│ (ECS Fargate)   │    │ (ECS Fargate)   │    │ (ECS Fargate)   │
│                 │    │                 │    │                 │
│  Port: 8084     │    │  Port: 8085     │    │  Port: 8086     │
│  Replicas: 3    │    │  Replicas: 3    │    │  Replicas: 3    │
│  Memory: 1GB    │    │  Memory: 1GB    │    │  Memory: 1GB    │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Prescription     │    │Notification     │    │  Chat Service   │
│   Service       │    │   Service       │    │                 │
│ (ECS Fargate)   │    │ (ECS Fargate)   │    │ (ECS Fargate)   │
│                 │    │                 │    │                 │
│  Port: 8087     │    │  Port: 8088     │    │  Port: 8089     │
│  Replicas: 3    │    │  Replicas: 3    │    │  Replicas: 3    │
│  Memory: 1GB    │    │  Memory: 1GB    │    │  Memory: 1GB    │
│  ✅ COMPLETED   │    │  ✅ COMPLETED   │    │  ✅ COMPLETED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RDS           │    │   ElastiCache   │    │   CloudWatch    │
│   PostgreSQL    │    │     Redis       │    │   Monitoring    │
│                 │    │                 │    │                 │
│  Port: 5432     │    │  Port: 6379     │    │  Port: 9090     │
│  Storage: 500GB │    │  Memory: 4GB    │    │  Memory: 2GB    │
│  Multi-AZ       │    │  Cluster Mode   │    │  Auto Scaling   │
│  Backup Enabled │    │  Replication    │    │  Alerting       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   S3 Storage    │
                    │   (Persistent)  │
                    │                 │
                    │  Database Backups│
                    │  Log Files      │
                    │  Static Assets  │
                    │  File Uploads   │
                    └─────────────────┘
```

## AWS Infrastructure Components

### Load Balancer
- **Technology**: AWS Application Load Balancer (ALB)
- **Purpose**: SSL termination, health checks, load balancing
- **Configuration**:
  - SSL certificates from AWS Certificate Manager
  - Target group health checks
  - Auto scaling integration
  - WAF integration for security

### API Gateway
- **Technology**: Spring Cloud Gateway (deployed on ECS)
- **Purpose**: Route requests to appropriate services
- **Features**:
  - Authentication and authorization
  - Rate limiting
  - Circuit breaker integration
  - Request/response transformation

### Container Orchestration

#### ECS Fargate Deployment

##### Service Definition
```yaml
# user-service-task-definition.json
{
  "family": "hms-user-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "user-service",
      "image": "account.dkr.ecr.region.amazonaws.com/hms/user-service:latest",
      "portMappings": [
        {
          "containerPort": 8081,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "aws"
        },
        {
          "name": "DB_HOST",
          "value": "hms-postgres.region.rds.amazonaws.com"
        },
        {
          "name": "REDIS_HOST",
          "value": "hms-redis.region.cache.amazonaws.com"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:hms/db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:hms/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hms-user-service",
          "awslogs-region": "region",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8081/actuator/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

##### Service Configuration
```yaml
# user-service-service.json
{
  "cluster": "hms-cluster",
  "serviceName": "hms-user-service",
  "taskDefinition": "hms-user-service",
  "desiredCount": 3,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-12345678", "subnet-87654321"],
      "securityGroups": ["sg-12345678"],
      "assignPublicIp": "DISABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/hms-user-service/12345678",
      "containerName": "user-service",
      "containerPort": 8081
    }
  ],
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100
  },
  "healthCheckGracePeriodSeconds": 60
}
```

### Database Architecture

#### RDS PostgreSQL Configuration
```yaml
# rds-postgresql.yaml
Resources:
  HMSDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: hms-postgres
      DBInstanceClass: db.t3.large
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 500
      StorageType: gp2
      StorageEncrypted: true
      MultiAZ: true
      BackupRetentionPeriod: 7
      PreferredBackupWindow: '03:00-04:00'
      PreferredMaintenanceWindow: 'sun:04:00-sun:05:00'
      DBName: hms
      MasterUsername: hms_admin
      MasterUserPassword: !Ref DBPassword
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      DeletionProtection: true
      MonitoringInterval: 60
      MonitoringRoleArn: !GetAtt MonitoringRole.Arn
      EnablePerformanceInsights: true
      PerformanceInsightsRetentionPeriod: 7
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: HMS
```

#### ElastiCache Redis Configuration
```yaml
# elasticache-redis.yaml
Resources:
  HMSRedis:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: hms-redis
      Description: HMS Redis Cluster
      NodeType: cache.t3.medium
      NumCacheClusters: 2
      AutomaticFailoverEnabled: true
      MultiAZEnabled: true
      Engine: redis
      EngineVersion: '7.0'
      Port: 6379
      PreferredMaintenanceWindow: 'sun:05:00-sun:06:00'
      SnapshotRetentionLimit: 7
      SnapshotWindow: '04:00-05:00'
      AtRestEncryptionEnabled: true
      TransitEncryptionEnabled: true
      CacheSubnetGroupName: !Ref CacheSubnetGroup
      SecurityGroupIds:
        - !Ref CacheSecurityGroup
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: HMS
```

### Monitoring and Observability

#### CloudWatch Configuration
```yaml
# cloudwatch-dashboard.yaml
Resources:
  HMSDashboard:
    Type: AWS::CloudWatch::Dashboard
    Properties:
      DashboardName: HMS-Production-Dashboard
      DashboardBody: !Sub |
        {
          "widgets": [
            {
              "type": "metric",
              "x": 0,
              "y": 0,
              "width": 12,
              "height": 6,
              "properties": {
                "metrics": [
                  ["AWS/ECS", "CPUUtilization", "ServiceName", "hms-user-service", "ClusterName", "hms-cluster"],
                  [".", "CPUUtilization", ".", "hms-patient-service", ".", "."],
                  [".", "CPUUtilization", ".", "hms-appointment-service", ".", "."]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${AWS::Region}",
                "title": "Service CPU Utilization"
              }
            },
            {
              "type": "metric",
              "x": 12,
              "y": 0,
              "width": 12,
              "height": 6,
              "properties": {
                "metrics": [
                  ["AWS/ECS", "MemoryUtilization", "ServiceName", "hms-user-service", "ClusterName", "hms-cluster"],
                  [".", "MemoryUtilization", ".", "hms-patient-service", ".", "."],
                  [".", "MemoryUtilization", ".", "hms-appointment-service", ".", "."]
                ],
                "period": 300,
                "stat": "Average",
                "region": "${AWS::Region}",
                "title": "Service Memory Utilization"
              }
            }
          ]
        }
```

#### CloudWatch Alarms
```yaml
# cloudwatch-alarms.yaml
Resources:
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: HMS-High-CPU-Utilization
      AlarmDescription: Alert when CPU utilization is high
      MetricName: CPUUtilization
      Namespace: AWS/ECS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: ServiceName
          Value: hms-user-service
        - Name: ClusterName
          Value: hms-cluster
      AlarmActions:
        - !Ref SNSTopicArn

  HighMemoryAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: HMS-High-Memory-Utilization
      AlarmDescription: Alert when memory utilization is high
      MetricName: MemoryUtilization
      Namespace: AWS/ECS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 85
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: ServiceName
          Value: hms-user-service
        - Name: ClusterName
          Value: hms-cluster
      AlarmActions:
        - !Ref SNSTopicArn
```

## Security Configuration

### IAM Roles and Policies
```yaml
# iam-roles.yaml
Resources:
  ECSTaskExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: hms-ecs-task-execution-role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
      Policies:
        - PolicyName: HMSSecretsAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - secretsmanager:GetSecretValue
                Resource: !Sub 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:hms/*'

  ECSTaskRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: hms-ecs-task-role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: HMSServiceAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - s3:GetObject
                  - s3:PutObject
                  - s3:DeleteObject
                Resource: !Sub 'arn:aws:s3:::hms-storage/*'
              - Effect: Allow
                Action:
                  - sqs:SendMessage
                  - sqs:ReceiveMessage
                  - sqs:DeleteMessage
                Resource: !GetAtt NotificationQueue.Arn
```

### Network Security
```yaml
# security-groups.yaml
Resources:
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: hms-alb-sg
      GroupDescription: Security group for ALB
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  ServiceSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: hms-service-sg
      GroupDescription: Security group for ECS services
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 8081
          ToPort: 8089
          SourceSecurityGroupId: !Ref ALBSecurityGroup
      SecurityGroupEgress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          DestinationSecurityGroupId: !Ref DatabaseSecurityGroup
        - IpProtocol: tcp
          FromPort: 6379
          ToPort: 6379
          DestinationSecurityGroupId: !Ref CacheSecurityGroup

  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: hms-database-sg
      GroupDescription: Security group for RDS
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref ServiceSecurityGroup
```

## CI/CD Pipeline

### AWS CodePipeline Configuration
```yaml
# codepipeline.yaml
Resources:
  HMSPipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      Name: hms-pipeline
      RoleArn: !GetAtt CodePipelineServiceRole.Arn
      Stages:
        - Name: Source
          Actions:
            - Name: Source
              ActionTypeId:
                Category: Source
                Owner: AWS
                Provider: CodeCommit
                Version: '1'
              Configuration:
                RepositoryName: hms-repository
                BranchName: main
              OutputArtifacts:
                - Name: SourceCode

        - Name: Build
          Actions:
            - Name: Build
              ActionTypeId:
                Category: Build
                Owner: AWS
                Provider: CodeBuild
                Version: '1'
              Configuration:
                ProjectName: !Ref HMSBuildProject
              InputArtifacts:
                - Name: SourceCode
              OutputArtifacts:
                - Name: BuildOutput

        - Name: Deploy
          Actions:
            - Name: Deploy
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: ECS
                Version: '1'
              Configuration:
                ClusterName: hms-cluster
                ServiceName: hms-user-service
                FileName: imagedefinitions.json
              InputArtifacts:
                - Name: BuildOutput
```

### AWS CodeBuild Configuration
```yaml
# codebuild.yaml
Resources:
  HMSBuildProject:
    Type: AWS::CodeBuild::Project
    Properties:
      Name: hms-build-project
      ServiceRole: !GetAtt CodeBuildServiceRole.Arn
      Artifacts:
        Type: CODEPIPELINE
      Environment:
        Type: LINUX_CONTAINER
        ComputeType: BUILD_GENERAL1_SMALL
        Image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
        EnvironmentVariables:
          - Name: AWS_DEFAULT_REGION
            Value: !Ref AWS::Region
          - Name: IMAGE_REPO_NAME
            Value: hms
          - Name: IMAGE_TAG
            Value: latest
        PrivilegedMode: true
      Source:
        Type: CODEPIPELINE
        BuildSpec: |
          version: 0.2
          phases:
            pre_build:
              commands:
                - echo Logging in to Amazon ECR...
                - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
                - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
                - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
                - IMAGE_TAG=${COMMIT_HASH:=latest}
            build:
              commands:
                - echo Build started on `date`
                - echo Building the Docker image...
                - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
                - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
            post_build:
              commands:
                - echo Build completed on `date`
                - echo Pushing the Docker image...
                - docker push $REPOSITORY_URI:$IMAGE_TAG
                - echo Writing image definitions file...
                - printf '[{"name":"hms-service","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
          artifacts:
            files:
              - imagedefinitions.json
```

## Environment Configuration

### Development Environment
```yaml
# dev-environment.yaml
Resources:
  DevCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: hms-dev-cluster
      CapacityProviders:
        - FARGATE
      DefaultCapacityProviderStrategy:
        - CapacityProvider: FARGATE
          Weight: 1

  DevDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: hms-dev-postgres
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 20
      StorageType: gp2
      StorageEncrypted: true
      MultiAZ: false
      BackupRetentionPeriod: 1
      DBName: hms_dev
      MasterUsername: hms_dev_admin
      MasterUserPassword: !Ref DevDBPassword
      VPCSecurityGroups:
        - !Ref DevDatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      DeletionProtection: false
```

### Staging Environment
```yaml
# staging-environment.yaml
Resources:
  StagingCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: hms-staging-cluster
      CapacityProviders:
        - FARGATE
      DefaultCapacityProviderStrategy:
        - CapacityProvider: FARGATE
          Weight: 1

  StagingDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: hms-staging-postgres
      DBInstanceClass: db.t3.small
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 100
      StorageType: gp2
      StorageEncrypted: true
      MultiAZ: true
      BackupRetentionPeriod: 3
      DBName: hms_staging
      MasterUsername: hms_staging_admin
      MasterUserPassword: !Ref StagingDBPassword
      VPCSecurityGroups:
        - !Ref StagingDatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      DeletionProtection: true
```

### Production Environment
```yaml
# production-environment.yaml
Resources:
  ProductionCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: hms-production-cluster
      CapacityProviders:
        - FARGATE
      DefaultCapacityProviderStrategy:
        - CapacityProvider: FARGATE
          Weight: 1

  ProductionDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: hms-production-postgres
      DBInstanceClass: db.t3.large
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 500
      StorageType: gp2
      StorageEncrypted: true
      MultiAZ: true
      BackupRetentionPeriod: 7
      DBName: hms_production
      MasterUsername: hms_production_admin
      MasterUserPassword: !Ref ProductionDBPassword
      VPCSecurityGroups:
        - !Ref ProductionDatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      DeletionProtection: true
      MonitoringInterval: 60
      MonitoringRoleArn: !GetAtt MonitoringRole.Arn
      EnablePerformanceInsights: true
      PerformanceInsightsRetentionPeriod: 7
```

## Backup and Recovery

### RDS Backup Strategy
```bash
#!/bin/bash
# rds-backup.sh

# Create backup directory
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier hms-production-postgres \
  --db-snapshot-identifier hms-backup-$(date +%Y%m%d-%H%M%S)

# Export RDS snapshot to S3
aws rds start-export-task \
  --export-task-identifier hms-export-$(date +%Y%m%d-%H%M%S) \
  --source-arn arn:aws:rds:region:account:snapshot:hms-backup-$(date +%Y%m%d-%H%M%S) \
  --s3-bucket-name hms-backups \
  --iam-role-arn arn:aws:iam::account:role/rds-s3-export-role \
  --kms-key-id arn:aws:kms:region:account:key/key-id

echo "Backup completed successfully"
```

### ElastiCache Backup Strategy
```bash
#!/bin/bash
# redis-backup.sh

# Create Redis snapshot
aws elasticache create-snapshot \
  --replication-group-id hms-redis \
  --snapshot-name hms-redis-backup-$(date +%Y%m%d-%H%M%S)

# Copy snapshot to S3
aws s3 cp redis-backup.rdb s3://hms-backups/redis/

echo "Redis backup completed successfully"
```

## Performance Optimization

### Auto Scaling Configuration
```yaml
# auto-scaling.yaml
Resources:
  UserServiceTargetTracking:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      MaxCapacity: 10
      MinCapacity: 3
      ResourceId: !Sub 'service/${HMSCluster}/${UserService}'
      RoleARN: !GetAtt ECSServiceAutoScalingRole.Arn
      ScalableDimension: ecs:service:DesiredCount
      ServiceNamespace: ecs
      TargetTrackingScalingPolicyConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ECSServiceAverageCPUUtilization
        TargetValue: 70.0
        ScaleInCooldown: 300
        ScaleOutCooldown: 300

  PatientServiceTargetTracking:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      MaxCapacity: 10
      MinCapacity: 3
      ResourceId: !Sub 'service/${HMSCluster}/${PatientService}'
      RoleARN: !GetAtt ECSServiceAutoScalingRole.Arn
      ScalableDimension: ecs:service:DesiredCount
      ServiceNamespace: ecs
      TargetTrackingScalingPolicyConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ECSServiceAverageCPUUtilization
        TargetValue: 70.0
        ScaleInCooldown: 300
        ScaleOutCooldown: 300
```

### CloudFront Distribution
```yaml
# cloudfront.yaml
Resources:
  HMSCloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: ALB
            DomainName: !GetAtt HMSALB.DNSName
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: https-only
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: ALB
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
            - PUT
            - POST
            - PATCH
            - DELETE
          CachedMethods:
            - GET
            - HEAD
            - OPTIONS
          ForwardedValues:
            QueryString: true
            Cookies:
              Forward: all
        PriceClass: PriceClass_100
        ViewerCertificate:
          AcmCertificateArn: !Ref SSLCertificate
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021
```

## Cost Optimization

### Resource Tagging
```yaml
# resource-tags.yaml
Resources:
  HMSService:
    Type: AWS::ECS::Service
    Properties:
      ServiceName: hms-user-service
      Cluster: !Ref HMSCluster
      TaskDefinition: !Ref HMSTaskDefinition
      DesiredCount: 3
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: HMS
        - Key: Service
          Value: UserService
        - Key: CostCenter
          Value: IT-Healthcare
        - Key: Owner
          Value: DevelopmentTeam
```

### Reserved Instances
```bash
#!/bin/bash
# purchase-reserved-instances.sh

# Purchase RDS Reserved Instances
aws rds purchase-reserved-db-instances-offering \
  --reserved-db-instances-offering-id "offering-id" \
  --db-instance-count 1

# Purchase ElastiCache Reserved Instances
aws elasticache purchase-reserved-cache-nodes-offering \
  --reserved-cache-nodes-offering-id "offering-id" \
  --cache-node-count 2

echo "Reserved instances purchased successfully"
```

## Disaster Recovery

### Multi-Region Setup
```yaml
# multi-region.yaml
Resources:
  # Primary Region (us-east-1)
  PrimaryCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: hms-primary-cluster
      CapacityProviders:
        - FARGATE

  # Secondary Region (us-west-2)
  SecondaryCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: hms-secondary-cluster
      CapacityProviders:
        - FARGATE

  # Route 53 Failover
  HMSFailoverRecord:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: !Ref HostedZoneId
      Name: hms.example.com
      Type: A
      SetIdentifier: primary
      Region: us-east-1
      Failover: PRIMARY
      AliasTarget:
        DNSName: !GetAtt PrimaryALB.DNSName
        HostedZoneId: !GetAtt PrimaryALB.CanonicalHostedZoneID
```

## Summary

The HMS AWS deployment architecture provides:

1. **Scalability**: Auto-scaling ECS services with Fargate
2. **Reliability**: Multi-AZ RDS and ElastiCache with failover
3. **Security**: IAM roles, security groups, and encryption
4. **Monitoring**: CloudWatch metrics, logs, and alarms
5. **Cost Efficiency**: Reserved instances and resource optimization
6. **Disaster Recovery**: Multi-region setup with Route 53 failover
7. **Maintainability**: CI/CD pipeline with automated deployments

This architecture ensures the HMS system is production-ready, secure, and scalable for enterprise healthcare environments on AWS cloud platform. 